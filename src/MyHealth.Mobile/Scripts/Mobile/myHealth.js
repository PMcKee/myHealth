var globalxsl;
var gloabalhtmlFragment;
var globalHtml;

var jQT = $.jQTouch({
    icon: 'myHealth.png',
    statusBar: 'black'
});


$(document).ready(function () {
    DataStoreInitilise();

    /*    $('#createEntry form').submit(createEntry);
    $('#createPatient form').submit(createPatient(
    $('#firstname').val(),
    $('#lastname').val(),
    $('#dob').val()
    ));
    */
    /*
    $('#createpatientButton').click(createPatient(
    $('#firstname').val(),
    $('#lastname').val(),
    $('#dob').val()));

    */
    $("#createpatientButton").click(function () {
        createPatient(
                $('#firstname').val(),
                $('#lastname').val(),
                $('#dob').val()
            );
        refreshPatients();
        jQT.goBack();
    });

    /*  $('.fileuploadUrl').click(function () {
    uploadFileFromUrl(this);
    }); */

    $('#btnCreateReferral').click(function () {
        $('#docContentsDivBind').load('./Templates/Note/Note.html');



        if (typeof template == "undefined") {
            $.getScript("CdaTemplates/Scripts/TemplateCore.js", function () {
                if (typeof TinyMCE == "undefined") {
                    $.getScript("CdaTemplates/Scripts/tiny_mce/jquery.tinymce.js", function () {
                        template.initilise('../Mobile/CdaTemplates/Scripts');
                    });
                };


            });
        }
        else {
            template.initilise('../Mobile/CdaTemplates/Scripts');
        };


    });

    $('#btnUploadDS').click(function () {
        $('#fileUrl').val('Data/DS.xml');
        $('#doctype').val('DS');
        uploadFileFromUrl(this);

        getAllDocuments();
        loadPatientDocuments(this, sessionStorage.currentPatientId)

        jQT.goBack();
    });

    $('#btnUploadPath').click(function () {
        $('#fileUrl').val('Data/labcdv.xml');
        $('#doctype').val('Pathology');
        uploadFileFromUrl(this);
        getAllDocuments();
        loadPatientDocuments(this, sessionStorage.currentPatientId)


        jQT.goBack();
    });

    $('#btnUploadCCD').click(function () {
        $('#fileUrl').val('Data/JH_CCD.xml');
        $('#doctype').val('CCD');
        uploadFileFromUrl(this);
        getAllDocuments();
        loadPatientDocuments(this, sessionStorage.currentPatientId)
        jQT.goBack();
    });

    $('#btnUploadReferral').click(function () {
        $('#fileUrl').val('Data/Referral.xml');
        $('#doctype').val('Referral');
        uploadFileFromUrl(this);
        getAllDocuments();
        loadPatientDocuments(this, sessionStorage.currentPatientId)
        jQT.goBack();
    });
    //btnUploadPatient
    $('#btnUploadPatient').click(function () {
        $('#fileUrl').val('Data/targetRecord.xml');
        $('#doctype').val('Patient');
        uploadFileFromUrl(this);
        getAllDocuments();
        loadPatientDocuments(this, sessionStorage.currentPatientId)
        jQT.goBack();
    });

    $('#cleanDb').click(function () {
        CleanTables();
        jQT.goBack();
    });


    $('#addDocument form').submit(addDocument);
    $('#settings form').submit(saveSettings);

    $('#settings').bind('pageAnimationStart', loadSettings);

    $('#mainMenuPatients').click(function () {
        refreshPatients();
    });

    $('#appointments li a').click(function () {

        var dayOffset = this.id;
        var date = new Date();
        date.setDate(date.getDate() - dayOffset);
        sessionStorage.currentDate = date.getMonth() + 1 + '/' +
                                     date.getDate() + '/' +
                                     date.getFullYear();
        refreshDateEntries();

    });

    CreateDataStore();
    GetPatient('1');


});


function renderCda(xmlDocument) {
    //// Render HTML from XML XSL
    //xsltProcessor = new XSLTProcessor();
    //xsltProcessor.importStylesheet('Content/mobileThemes/CDA.xsl');
    //resultDocument = xsltProcessor.transformToFragment(xmlDocument, document);
    //alert('Render Complete');
    //document.getElementById("example").appendChild(resultDocument);

    //----
    console.log("xmldocument:" ,xmlDocument);

    if (!xmlDocument) {console.log("xmldoc null");return;}

    //var xPathResult = xmlDocument.evaluate('//p', document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var parser = new DOMParser();
    try {
        console.log("data", xmlDocument);
        xmlDoc = parser.parseFromString(xmlDocument, "text/xml");
        console.log("doc", xmlDoc);
        
        
//        //var xPathResult = xmlDoc.evaluate('/clinicaldocument/component/structuredbody/component/section', xmlDoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
//        var xPathResult = xmlDoc.evaluate('/clinicaldocument', xmlDoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
//        //console.log("length:", xPathResult.snapshotLength);
//        console.log("rerult", xPathResult);
//        
//        for (var i = 0; i < xPathResult.snapshotLength; i++) {
//            dump(nodesSnapshot.snapshotItem(i).textContent);
//            console.log("item:", nodesSnapshot.snapshotItem(i));
//        
//        };

    } catch (e) {
        console.log('error', e);
    };



    //xml = loadXMLDoc("Data/DS.xml");
    //xml = xmlDocument;
    console.log("Load xsl");
    xsl = loadXMLDoc("Data/CDA.xsl");
    globalxsl = xsl;
    var resultDocument = "empty";
    
    if (document.implementation && document.implementation.createDocument) {
        console.log("parse"); 
        var xmlobject = (new DOMParser()).parseFromString(xmlDocument, 'text/xml');
    
        // code for Mozilla, Firefox, Opera, etc.
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl);
        resultDocument = xsltProcessor.transformToFragment(xmlobject, document);
        console.log("HTML Fragment:", resultDocument);

    }
    console.log('HTML as String: ' , (new XMLSerializer()).serializeToString(resultDocument));
    globalHtml = (new XMLSerializer()).serializeToString(resultDocument);

    return (new XMLSerializer()).serializeToString(resultDocument);
    //return resultDocument;
    //document.getElementById("example").appendChild(resultDocument);
    
    //----
}

function loadXMLDoc(dname) {
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    }
    else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET", dname, false);
    xhttp.send("");
    return xhttp.responseXML;
}


function loadSettings() {
    $('#age').val(localStorage.age);
    $('#budget').val(localStorage.budget);
    $('#weight').val(localStorage.weight);
}


function saveSettings() {
    localStorage.age = $('#age').val();
    localStorage.budget = $('#budget').val();
    localStorage.weight = $('#weight').val();
    jQT.goBack();
    return false;
}


function BindEditPatient(button, id) {
    var clickedPatient = $(button).parent();
    console.log('.cancel', $('.cancel'));
    setCurrentPatient(id);

    //jQT.goTo($('#createPatient'), 'flip');

/*    $('#createPatient .cancel').click(function () {
        alert('Go back ');
        jQT.goBack();
        jQT.goTo($('#patients'), 'flip');
        
    });*/

    editPatientById(id);

}


function BindDeletePatient(button, id){
    var clickedPatient = $(button).parent();
    clickedPatient.slideUp();
    deletePatientById(id);

}

function BindDeleteDocument(button, id) {
    var clickedDocument = $(button).parent();
    clickedDocument.slideUp();
    deleteDocumentById(id);

}


function handle_files(files) {
    var data = new Array();

    for (i = 0; i < files.length; i++) {
            
        file = files[i]
        /*console.log(file)*/

        var reader = new FileReader()

        reader.onload = function (e) {
            data.push = e.target.result;
            createDocument(sessionStorage.currentPatientId, e.target.result, 'unknown');
        }
            
        reader.onerror = function (error) {
            console.log("error", error)
            console.log(error.getMessage())
        }
            
        reader.readAsText(file) //readAsdataURL

        return data;
    }

}

function loadPatientDocuments(element, patientId) {
    currentPatientId = patientId;
    sessionStorage.currentPatientId = currentPatientId

    var patient = GetPatient(currentPatientId);
    setCurrentPatient(patient);

    var docs = getDocumentsForPatient(currentPatientId);
    /*$('#groupedDocsaa li').each(function (n, item) {
            $(item).remove();
        });
        */
    setDouments(docs);
    sessionStorage.currentPatient = currentPatient;
}



function loadDocument(element, documentId) {
    //alert(documentId);
    sessionStorage.currentDocumentId = documentId;

    var doc = getDocument(documentId);
}


function uploadFileFromUrl(element) {
    var patientId = sessionStorage.currentPatientId;
    $.ajax({
        type: "GET",
        url: $('#fileUrl').val(),
        dataType: "text",
        success: function (xml) {
            createDocument(patientId, xml, $('#doctype').val());
        }
    });
}
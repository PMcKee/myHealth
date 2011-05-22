var globalxsl;
var gloabalhtmlFragment;

var jQT = $.jQTouch({
    icon: 'myHealth.png',
    statusBar: 'black'
});


$(document).ready(function () {

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

    $('#cleanDb').click(function () {
        CleanTables();
        jQT.goBack();
    });

    //$('#settings form').submit(saveSettings);

    //$('#settings').bind('pageAnimationStart', loadSettings);

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

});



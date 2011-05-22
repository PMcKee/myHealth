var myhealthDataStoreage = myhealthDataStoreage || {};

var db;
var allDocuments;

function DataStoreInitilise() {
    CreateDataStore();
    //CleanDataStore();
    documents = [];
    getAllDocuments();
    //createDocument(5, 'abcd', 'ds');

}


myhealthDataStoreage.OpenDatabase = function(){
    var shortName = 'myHealth';
    var version = '1.0';
    var displayName = 'myHealth';
    var maxSize = 65536;
    db = window.openDatabase(shortName, version, displayName, maxSize);
}



function CreateDataStore() {

    if (db == null) { myhealthDataStoreage.OpenDatabase(); }

    db.transaction(
        function (transaction) {

            transaction.executeSql(
                'CREATE TABLE IF NOT EXISTS appointments ' +
                '   (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
                '    date DATE NOT NULL, ' +
                '    patient TEXT NOT NULL, ' +
                '    patientId INTEGER, ' +
                '    reason TEXT NOT NULL);'
            );

            //patients
            transaction.executeSql(
                'CREATE TABLE IF NOT EXISTS patients ' +
                '   (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
                '    dateCreated DATE NOT NULL, ' +
                '    firstname TEXT NOT NULL, ' +
                '    lastname TEXT NOT NULL, ' +
                '    dateOfBirth DATE NOT NULL);'
            );


            //Documents
            transaction.executeSql(
                'CREATE TABLE IF NOT EXISTS documents ' +
                '   (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
                '    dateCreated DATE NOT NULL, ' +
                '    patientId INTEGER NOT NULL, ' +
                '    doctype TEXT NOT NULL, ' +
                '    eventTime DATE NOT NULL, ' +
                '    document TEXT NOT NULL); ' 
            );


        }
        );

    }


    function CleanTables() {

        if (db == null) {myhealthDataStoreage.OpenDatabase(); }

        db.transaction(
        function (transaction) {
        
            transaction.executeSql('DROP TABLE appointments ;');

            //patients
            transaction.executeSql('DROP TABLE patients;');

            //Documents
            transaction.executeSql('DROP TABLE documents;');
        });

        CreateDataStore();

    }


    function createPatient(patientFirstName, patientLastName, patientDoB) {
        var dateCreated = new Date();

        db.transaction(
            function (transaction) {

                transaction.executeSql(
                    'insert into patients (firstname, lastname, dateOfBirth, dateCreated) VALUES (?, ?, ?, ?);',
                    [patientFirstName, patientLastName, patientDoB, dateCreated],
                    null,
                    errorHandler
                );

            });

        //return false;
    }


    function GetPatient(patientid) {
        //var currentDate = sessionStorage.currentDate;
        //$('#date h1').text(currentDate);
        //$('#date ul li:gt(0)').remove();
        var patient;
        db.transaction(
        function (transaction) {

            transaction.executeSql(
                    'SELECT * FROM patients WHERE id = ?;',
                    [patientid],
                function (transaction, result) {
                    if (result.rows.length == 1) {
                        var row = result.rows.item(0);
                        patient = newPatient(row.id, row.firstname, row.lastname, row.dateOfBirth, row.dateCreated);
                        setCurrentPatient(patient);
                    } else {
                        //alert('Patient id: ' + patientid + ' not found. Rows found: ' + result.rows.length); 
                    }
                    //return patient;
                    //setCurrentPatient(patient);
                },
                errorHandler
            );
        }

    );
            return patient;
    }




    function createDocument(patientid, document, doctype) {
        var eventTime = new Date();
        var dateCreated = new Date();
        var doc = newDocument(99, patientid, doctype, document, eventTime, dateCreated);
        documents.push(doc);


        if (db == null) { OpenDataStore(); }

        db.transaction(
                function (transaction) {
                    transaction.executeSql(
                        'INSERT INTO documents (patientId, document, doctype, eventTime, dateCreated) VALUES (?, ?, ?, ?, ?);',
                        [patientid, document, doctype, eventTime, dateCreated],
                        function () {
                            //getAllDocuments();
                            //loadPatientDocuments(null, patientid);
                            //jQT.goBack();
                        },
                        errorHandler);
                }
            );

        getAllDocuments();
        loadPatientDocuments(null, patientid);
        //return false;
    }


    function newPatient(id, firstname, lastname, dob, dateCreated) {

        var pat = {
            id: id,
            firstName: firstname,
            lastName: lastname,
            dateOfBirth: dob,
            dateCreated: dateCreated
        };
        return pat;

    };


    function createEntry() {
        var date = sessionStorage.currentDate;
        var patient = $('#appointmentpatienName').val();
        var reason = $('#appointmentReason').val();
        db.transaction(
        function (transaction) {
            transaction.executeSql(
                'INSERT INTO appointments (date, patient, reason) VALUES (?, ?, ?);',
                [date, patient, reason],
                function () {
                    refreshDateEntries();
                    jQT.goBack();
                },
                errorHandler
            );
        }
    );
        return false;
    }



    function refreshDateEntries() {
        var currentDate = sessionStorage.currentDate;
        $('#date h1').text(currentDate);
        $('#date ul li:gt(0)').remove();
        db.transaction(
        function (transaction) {
            transaction.executeSql(
                'SELECT * FROM appointments WHERE date = ? ORDER BY patient;',
                [currentDate],
                function (transaction, result) {
                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows.item(i);
                        var newEntryRow = $('#entryDateTemplate').clone();
                        newEntryRow.removeAttr('id');
                        newEntryRow.removeAttr('style');
                        newEntryRow.data('entryId', row.id);
                        newEntryRow.appendTo('#date ul');
                        newEntryRow.find('.label').text(row.patient);
                        newEntryRow.find('.calories').text(row.reason);

                        newEntryRow.find('.delete').click(function () {
                            var clickedEntry = $(this).parent();
                            var clickedEntryId = clickedEntry.data('entryId');
                            deleteEntryById(clickedEntryId);
                            clickedEntry.slideUp();
                        });
                    }
                },
                errorHandler
            );
        }
    );
    }


    function getDocumentsForPatient(PatientId) {

        var patientDocs = [];

        for (var i = 0; i < allDocuments.length; i++) {
            if (allDocuments[i].patientId == PatientId) {
                patientDocs.push(allDocuments[i]);
            }
        }

        return patientDocs;

    }

    function getDocument(documentId) {

        db.transaction(
            function (transaction) {

                // eventTime DATE
                transaction.executeSql(
                    'SELECT id,dateCreated, patientId, document, doctype, eventTime  FROM documents WHERE id = ?;',
                    [documentId],
                    function (transaction, result) {

                        var docz = [];
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);

                            var doc = newDocument(row.id, row.patientId, row.doctype, row.document, row.eventTime, row.dateCreated);
                            SetCurrentDocument(doc);
                        }
                    },
                    errorHandler

                );

            }
        );
    }


    function getAllDocuments() {

        db.transaction(
            function (transaction) {

                // eventTime DATE
                transaction.executeSql(
                    'SELECT id,dateCreated, patientId, document, doctype, eventTime  FROM documents ORDER BY eventTime desc;',
                    [],
                    function (transaction, result) {

                        var docz = [];
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            var doc = newDocument(row.id, row.patientId, row.doctype, row.document, row.eventTime, row.dateCreated);
                            docz.push(doc);
                        }
                        allDocuments = docz;
                    },
                    errorHandler

                );

            }
        );
    }





    function deleteEntryById(id) {
        db.transaction(
            function (transaction) {
                transaction.executeSql('DELETE FROM appointments WHERE id=?;', [id], null, errorHandler);
            }
        );
    }

    function refreshPatients() {
        db.transaction(
        function (transaction) {
            transaction.executeSql(
                'SELECT * FROM patients ORDER BY lastname, firstname;',
                [],
                function (transaction, result) {
                    clearPatients();

                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows.item(i);
                        addPatient(row.id, row.firstname, row.lastname, row.dateOfBirth, row.dateCreated);
                    }
                },
                errorHandler
            );
        }
    );
    }

    function deletePatientById(id) {
        db.transaction(
        function (transaction) {
            transaction.executeSql('DELETE FROM patients WHERE id=?;', [id], null, errorHandler);
        }
    );
    }

    function deleteDocumentById(id) {
        db.transaction(
        function (transaction) {
            transaction.executeSql('DELETE FROM documents WHERE id=?;', [id], null, errorHandler);
        }
    );
    }

    function errorHandler(transaction, error) {
        alert('Oops. Error was ' + error.message + ' (Code ' + error.code + ')');
        return true;
    }

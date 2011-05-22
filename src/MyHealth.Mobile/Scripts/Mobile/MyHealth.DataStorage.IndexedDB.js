var indexed_db;


function CreateDataStore() {
    // IndexDb
    // Initialising the window.IndexedDB Object
    indexedDB = window.moz_indexedDB || window.webkitIndexedDB;
    window.IDBKeyRange = window.webkitIDBKeyRange;

    indexed_db = indexedDB.open('myHealth', 'My Health', false);
    if (indexed_db.version !== '1.0') {
        var olddb = indexedDB.open('myHealth', 'My Health');

        // Create Documents Store
        olddb.createObjectStore('documents', 'patientId');
        olddb.createIndex('DocumentType', 'documents', 'type', false);

        //Set the DB Version
        olddb.setVersion("1.0");
    }

    // db.version === "1.0";  
    //    var index = indexed_db.openIndex('DocumentType');
    var matching = index.get('DS');
    if (matching)
        report(matching.patientId, matching.type, matching.datecreated);
    else
        report(null);

}


function createDocument(patientid, document, doctype) {
    var patientId = sessionStorage.currentPatientId;
    var eventTime = new Date();
    var dateCreated = new Date();
    var docType = 'DS';

    // Index DB
    //matching.patientId, matching.type, matching.datecreated
    var db = html5rocks.indexedDB.db;
    var trans = db.transaction(["Adddocs"], IDBTransaction.READ_WRITE, 0);
    var store = trans.objectStore("documents");
    var request = store.put({
        "patientId": patientId,
        "type": docType,
        "document": document,
        "dateCreated": new Date().getTime()
    });

    request.onsuccess = function (e) {
        console.log(e.value);
    };

    request.onerror = function (e) {
        console.log(e.value);
    };
        
}
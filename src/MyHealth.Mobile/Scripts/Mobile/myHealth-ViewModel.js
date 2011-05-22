var patients = [];
var currentPatientId;
var currentPatient = newPatient(null,"","","","") ;
var currentDocument = newDocument(-1, -1,'n/a', "No document selected", null,null);
var documents = [];

var viewModel = { 
    chosenPatient: ko.observable(patients[0]),
    doocuments: ko.observable(documents)
 };

function setCurrentPatient(patient) {
    if (patient != null) {
        currentPatient = patient;
        ko.applyBindings(currentPatient);
    }
}

/// PATIENTS
function addPatient(id, firstname, lastname, dob, dateCreated) {

    var patient = newPatient(id, firstname, lastname, dob, dateCreated);
    patients.push(patient);
        
    ko.applyBindings(viewModel);
    return patient;
}


function newPatient(id, firstname, lastname, dob, dateCreated) {    
    
    var pat =  {
        id: id,
        firstName: firstname,
        lastName: lastname,
        dateOfBirth: dob,
        dateCreated: dateCreated
    };
    return pat;
    
};



function clearPatients() {
    patients = [];
    //addPatient('', '', '01/01/0001');
    ko.applyBindings(patients);
    // patients.pop
}

function formatPatientName(patient) {
    return patient.firstName + " " + patient.lastName + ' (' + patient.dateOfBirth + ')';
}


function bindPatients() {
    ko.applyBindings(viewModel);
    ko.applyBindings(patients);
}

function SetCurrentDocument(doc) {
    currentDocument = doc;
    ko.applyBindings(currentDocument);
}

function setDouments(docs) {
    documents = docs;
    ko.applyBindings(documents);
    ko.applyBindings(viewModel);

}

// DOCUMENTS 
function addDocument(id, patientId, docType, document, eventTime, dateCreated) {

    var doc = newDocument(id, patientId, docType, document, eventTime, dateCreated);
    documents.push(document);
    ko.applyBindings(documents);
 
}

function newDocument(id, patientId, doctype, document, eventTime, dateCreated) {
    var document = {
        id: id,
        patientId: patientId,
        doctype: doctype,
        document: document,
        eventTime: eventTime,
        dateCreated: dateCreated
    };

    return document;

}

function clearDocuments() {
    documents = [];
    ko.applyBindings(documents);
 
}


$(document).ready(function () {
   // ko.applyBindings(viewModel);
});

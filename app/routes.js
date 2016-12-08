// create a new express router
const express      = require('express'),
  router           = express.Router(),
  notesController  = require('./controllers/notes.controller');

// export router
module.exports = router;

// define routes
// main routes
router.get('/', 				notesController.showNotes);

// note routes
router.get('/notes',       		notesController.showNotes);

// create note
router.get('/notes/create',  	notesController.showCreate);
router.post('/notes/create', 	notesController.processCreate);

// seed notes (only fr testing)
//router.get('/notes/seed',  		notesController.seedNotes);

// edit note
router.get('/notes/:guid/edit', notesController.showEdit);
router.post('/notes/:guid',     notesController.processEdit);

// delete note
router.get('/notes/:guid/delete', notesController.deleteNote);

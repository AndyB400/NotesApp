// create a new express router
const express      = require('express'),
  router           = express.Router(),
  mainController   = require('./controllers/main.controller'),
  notesController = require('./controllers/notes.controller');

// export router
module.exports = router;

// define routes
// main routes
router.get('/', 				mainController.showHome);

// note routes
router.get('/notes',       		notesController.showNotes);

// create note
router.get('/notes/create',  	notesController.showCreate);
router.post('/notes/create', 	notesController.processCreate);

// edit note
router.get('/notes/:id/edit', 	notesController.showEdit);
router.post('/notes/:id',     	notesController.processEdit);

// delete note
router.get('/notes/:id/delete', notesController.deleteNote);

// show a single note
router.get('/notes/:id', 		notesController.showSingle);
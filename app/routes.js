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

// edit note
router.get('/notes/:guid/edit', notesController.showEdit);
router.post('/notes/:guid',     notesController.processEdit);

// delete note
router.get('/notes/:guid/delete', notesController.deleteNote);


router.get(function(req,res){
    res.render('pages/404notfound');
});
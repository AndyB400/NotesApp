const filesUtil		= require('filesUtil'),
	  dataPath = path.resolve('/', '..') + '\\data';;

module.exports = {
	list: list,
	find: find
}

function list(callback){
	
	checkDirectory(dataPath, (err) => {  
		if(err) {
			console.log(`Unable to access path: ${dataPath}`, err);
		} 
		else {
	    
			fs.readdir(dataPath, (err, files) => {
				if (err) 
			    	console.log(`Unable to read directory: ${dataPath}`);

			    var notes = [];
			    for (var file of files){

			    	loadNoteFromFileName(path.join(dataPath,file), (err, note) => {
			    		if(err)
			    			console.log(`Unable to load file:${file}`, err);
			    		else
			    			notes.push(note);
			    	});
			    }

		    	callback(err, notes);
		    });
	    }
    });
}


function find(id, callback){

	jsonFile.readFile(dataPath + req.params.id + '.json', (err, note) => {
		if (err) {
			res.status(404);
			res.send('Note not found!');
		}

	    // Load from json

	    res.render('pages/single', { 
	      note: note,
	      success: req.flash('success')
	    });
	});
}

/*
* Checks if a directory exists, and create it if it doesn't
* @param directory - the path of the directory to check
*/
function checkDirectory(directory, callback) {  
  fs.stat(directory, (err, stats) => {
    //Check if error defined and the error code is "not exists"
    if (err && err.errno === 34) {
      //Create the directory, call the callback.
      fs.mkdir(directory, callback);
    } else {
      //just in case there was a different error:
      callback(err)
    }
  });
}

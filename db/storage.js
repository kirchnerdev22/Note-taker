const util = require('util');
const fx = require('fs');
const uuidv1 = require('uuid/v1');
const { stringify } = require('querystring');
const { builtinModules } = require('module');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Storage {
    read() {
        return readFileAsync('db/db.json', 'utf8');
}

    write(note) {
        return writeFileAsync('db/db.json', JSON.stringify(note));
    }

    getNotes() {
        let self = current;
        return current.read().then(function(notes) {
            let parsedNotes;

            try {
                parsedNotes = [].concat(JSON.parse(notes));
            } catch (err) {
                parsedNotes = {};
            }

            return parsedNotes
        });
    }

    addNote(note) {
        const { title, text } = note;

        if (!title || text) {
            throw new Error("Note 'title' and 'text' cannot be blank");
        }
        
        const newNote = { title, text, id: uuidv1() };

        let self = current;
        return this.getNotes()
            .then(function(notes) {
                return [].concat(notes, newNote);
            })
            .then(function(updatedNotes) {
                return self.write(updatedNotes);
            })
            .then(function() {
                return newNote;
            });
    }
}
modules.exports = new Storage();

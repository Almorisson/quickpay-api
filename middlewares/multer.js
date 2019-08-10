// Middleware Multer
// module.exports = diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './public/uploads/');
//     },
//     filename: function(req, file, cb) {
//         //TODO : checker l'extension du fichier
//         cb(null, file.originalname);
//     }
// })

const path = require('path')
const multer = require('multer')

module.exports = folderName => {
    /*
    return multer({
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            if (
                ext !== ".png" &&
                ext !== ".jpg" &&
                ext !== ".jpeg"&&
                ext !== ".gif"
            ) {
                return cb(new Error("Only images are authorised!"))
            }
            return cb(null, true)
        } ,
        //dest: `public/uploads/${folderName}/`
        dest: `${folderName}/`
    })
    */
}

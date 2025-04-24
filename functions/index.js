let size;
let file;
let format;
let censored;

export default async function lastfmHandler(req, res) {

    size = req.query.size;
    file = req.query.file;
    format = req.query.format;
    censored = req.query.censored;


    res.status(200).json({size:size,file:file,format:format,censored:censored});
}

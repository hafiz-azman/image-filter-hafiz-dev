import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {
  isImageUrl,
  filterImageFromURL,
  deleteLocalFiles
} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get('/filteredImage', (req: Request, res: Response) => {
    const { image_url } = req.query

    if (!image_url) {
      return res.status(400).send('image_url is required. Hint - {{ url }}/filteredImage?image_url={{ hello image_url put here }}')
    }

    if (!isImageUrl(image_url)) {
      return res.status(400).send('The image_url that you have provided is not an image url :/')
    }

    filterImageFromURL(image_url).then(filteredImagePath => {
      res.sendFile(filteredImagePath, error => {
        if (error) {
          res.status(500).send(`Error when sending back the filtered image: ${ error }`);
        }

        deleteLocalFiles([filteredImagePath])
      })
    }).catch(error => res.status(500).send(`Error when filtering the image: ${ error }`))

  })

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("Hey there! Try GET /filteredImage?image_url={{}}")
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
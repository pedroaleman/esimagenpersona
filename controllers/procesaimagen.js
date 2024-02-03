const googleService = require('../services/googleApiService')
const fs = require('fs');


async function getProperties(req, res){
      const llaveEsperada = 'JNV9pK3em1YCS16CzFUOdO7fVG3RkO0IrTzeOJ48yFI=';
      const llaveRecibida = req.headers['llave'];
      if(llaveRecibida == null || llaveRecibida === undefined){
        console.log('Debe enviar la llave de autorización: ')
        res.status(401).send({success: false, message: 'Debe enviar la llave de autorización: '});
        return;
      }
      else{
        if(llaveEsperada != llaveRecibida){
          console.log('Llave incorrecta: ')
          res.status(401).send({success: false, message: 'Llave incorrecta'});
          return;
        }
      }
      
      try {
        if(req.files){
            //console.log('req.files: ', req.files)
            let imagen_path = req.files.img.path;
            let name = req.files.img.name;
           

          const arrObjetos = await googleService.getObjects(imagen_path);      
          if(arrObjetos == null){
            res.status(500).send({success: false, message: 'No fue posible procesar imagen', result: null});
            return;
          }

          let cadenaObjetos = arrObjetos.join().toLowerCase();
          let esPersona = false;
          if(cadenaObjetos.includes('person'))
            esPersona = true;

          /*
          
          const objTraduccion = await googleService.translateText(cadenaObjetos);
          if(objTraduccion == null){
            res.status(500).send({success: false, message: 'No fue posible traducir objetos detectados', result: null});
            return;
          }

          //Quitar acentos y convertir a minísculas
          let sinAcentos = generic.quitarAcentos(objTraduccion[0]);
          sinAcentos = sinAcentos.toLowerCase();
          */

         //Eliminar archivo al final de usarlo
          // Verificar si el archivo existe antes de intentar eliminarlo
          if (fs.existsSync(imagen_path)) {
            fs.unlinkSync(imagen_path);
          }

        let obj = {success: true, message: 'Proceso Terminado',isperson: esPersona};

        res.status(200).send(obj);
      }
    } catch (error) {
        console.log('Error Google Service: ', error)
        res.status(500).send({success: false, message: error, isperson: false});
    }


}


module.exports = {
	getProperties
}
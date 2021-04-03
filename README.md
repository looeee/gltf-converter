# GLTF Exporter

This app allows to you allows you to convert to glTF format version using the three.js <a href="https://threejs.org/examples/#misc_exporter_gltf">GLTFExporter</a>.

## Instructions

Clone/download the repo. Node.js and NPM are required.


Run this command once.
``` bash
> npm install
```

Then run this command to build code and start the server.
``` bash
> npm start
```

### Supported formats:

* 3MF
* AMF
* FBX
* OBJ and MTL
* GLTF and GLB version 2 (because why not? )
* Collada ( DAE )
* PCD (ASCII and Binary)
* PLY (ASCII and Binary)
* STL (ASCII and Binary)

Upload any textures alongside the model in JPG, PNG, GIF, BMP format ( just upload all the files at the same time and the converter will handle the rest ).

Not all three.js loaders have been implemented, however adding a new one is quite simple. Pull requests are welcome, or open an issue if you need a loader added.

### Limitations

* Multimaterials are not supported. Any model that uses multimaterials will probably not export at all, although this will be fixed very soon
* The exporter currently always exports [MeshStandardMaterial](https://threejs.org/docs/#api/materials/MeshStandardMaterial). Other materials will be converted to this material type and may lose information
* Models are loaded using three.js loaders. Some of these (FBX, Collada, OBJ, glTF) support pretty much everything that you can throw at them. Others are more limited, however if you upload a model and it doesn't even display in the original preview below, you can help improve the loaders by filing a [bug report](https://github.com/mrdoob/three.js/issues) and sharing your model.

All conversion happens on your PC, at no point are any models or textues uploaded to my server or stored in any way.

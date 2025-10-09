import mongoose from "mongoose";


const usuarioSchema = new mongoose.Schema(
    {
        nombre:{type:String, required: true, default:''},
        apellidos:{type:String, required:true, default:''},
        telefono:{type:String,
                    required:[true, 'tlf obligatorio'],
                    match:[new RegExp('^\\(?\\+?\\d{2}\\)?\\d{9}$'), 'el telefono no cumple con patron, debe ser +341112233']
                },
        email:{type:String, required: true, default:''},
        password:{type:String, required:true,default:''},
        favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plato' }],
        opiniones:[{type:mongoose.Schema.Types.ObjectId,ref:'Opinion'}],

    }
)

export default mongoose.model("Usuario", usuarioSchema,"usuarios");
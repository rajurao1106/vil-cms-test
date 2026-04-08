import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    headOffice: { 
        type: String, 
        trim: true,
        default: "Vaswani Industries Limited, Sondra, Phase-II, Bahesar Road, Siltara, Raipur, CG"
    },
    cityOffice: { 
        type: String, 
        trim: true 
    },
    // Array of objects kyunki sister concerns multiple ho sakti hain
    sisterConcerns: [{
        name: { type: String, trim: true },
        websiteLink: { type: String, trim: true }
    }]
}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema);
export default Address;
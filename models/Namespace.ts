import mongoose, { Document } from 'mongoose';

export interface INamespace extends Document {
  userEmail: string;
  name: string;
}

const namespaceSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Namespace = mongoose.models.Namespace
  ? mongoose.model<INamespace>('Namespace')
  : mongoose.model<INamespace>('Namespace', namespaceSchema);

export default Namespace;

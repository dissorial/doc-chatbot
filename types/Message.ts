import SourceDoc from './SourceDoc';

interface Message {
  message: string;
  type: string;
  sourceDocs?: SourceDoc[];
}

export default Message;

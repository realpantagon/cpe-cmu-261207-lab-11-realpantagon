import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  //get ids from url
  if (req.method === "DELETE") {
    const roomId = req.query.roomId;
    const messageId = req.query.messageId;

    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }

    const rooms = readChatRoomsDB();
    const room = rooms.find((x) => {
      return x.roomId === roomId;
    });
    //check if roomId exist
    if (room == undefined) {
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    }

    const message = room.messages.find((message) => {
      return message.messageId === messageId;
    });

    if (message == null)
      return res.status(404).json({
        ok: false,
        message: "Invalid message id",
      });

    //check if token owner is admin, they can delete any message
    //or if token owner is normal user, they can only delete their own message!
    if (user.isAdmin || message.username === user.username) {
      room.messages = room.messages.filter(
        (message) => message.messageId !== messageId
      );
      writeChatRoomsDB(rooms);
      return res.json({
        ok: true,
      });
    } else {
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to access this data",
      });
    }

    //check if messageId exist
  }
}

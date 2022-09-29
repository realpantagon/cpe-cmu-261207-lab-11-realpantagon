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
    if (room == undefined) {
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    } else {
      const message = room.messages.find((x) => {
        return x.messageId === messageId;
      });
      if (message == undefined) {
        return res
          .status(404)
          .json({ ok: false, message: "Invalid message id" });
      } else {
        room.messages = room.messages.filter((x) => {
          return messageId != x.messageId;
        });
        writeChatRoomsDB(rooms);
        return res.json({ ok: true });
      }
    }
  }

  //check if roomId exist

  //check if messageId exist

  //check if token owner is admin, they can delete any message
  //or if token owner is normal user, they can only delete their own message!
}

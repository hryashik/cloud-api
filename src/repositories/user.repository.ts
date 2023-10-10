import User from "../models/User";

class UserRepository {
   findOne(email: string) {
      const user = User.findOne({ email });
   }
}

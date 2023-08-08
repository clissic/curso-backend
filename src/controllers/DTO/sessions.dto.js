class UserDTO {
  constructor(session) {
    this.email = session.email || null;
    this.first_name = session.first_name || null;
    this.last_name = session.last_name || null;
    this.role = session.role || null;
    this.cartId = session.cartId._id || null;
  }
}

export default UserDTO;
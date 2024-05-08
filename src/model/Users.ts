export class User {
  id: number
  name: string
  username: string
  email: string
  phone: string

  constructor(user: User) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.email = user.email
    this.phone = user.phone
  }
}

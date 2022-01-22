export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: 'ADMIN_ROLE' | 'USER_ROLE',
    public uid?: string,
    public estado?: boolean
  ) {}

  get imagenUrl() {
    if (!this.img) {
      return 'https://res.cloudinary.com/dfz7ok73b/image/upload/v1632932566/no-image/no-image_qydohn.jpg';
    } else if (this.img?.includes('http')) {
      return this.img;
    } else {
      return 'https://res.cloudinary.com/dfz7ok73b/image/upload/v1632932566/no-image/no-image_qydohn.jpg';
    }
  }
}

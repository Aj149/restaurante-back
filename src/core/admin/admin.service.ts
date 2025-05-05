import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>
  ) {}

  async loginAdmin(dto: CreateAdminDto): Promise<{ access_token: string }> {
    const { cedula, password } = dto;

    // Verificar si el administrador existe
    const admin = await this.adminRepository.findOne({ where: { cedula } });

    if (!admin) {
      throw new Error('Invalid credentials');
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generar token JWT
    const payload = { sub: admin.id, cedula: admin.cedula };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { access_token };
  }

  // Método para registrar un administrador (opcional)
  async registerAdmin(dto: CreateAdminDto): Promise<Admin> {
    const { cedula, password } = dto;
  
    try {
      // Verificar si ya existe un administrador con la misma cédula
      const existingAdmin = await this.adminRepository.findOne({ where: { cedula } });
      if (existingAdmin) {
        throw new Error('El administrador ya existe');
      }
  
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newAdmin = this.adminRepository.create({
        cedula,
        password: hashedPassword,
      });
  
      return await this.adminRepository.save(newAdmin);
    } catch (error) {
      throw new Error(`Error al registrar el administrador: ${error.message}`);
    }
  }
  
}

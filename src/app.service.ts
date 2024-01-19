import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './modelo/cliente';

@Injectable()
export class AppService {
  
  constructor(
    @InjectRepository(Cliente)
    private clienteRepositorio: Repository<Cliente>
  ){ }

  public listarTodos(): Promise<Cliente[]>{
    return this.clienteRepositorio.find();
  }

  public async buscarPorId(id:number): Promise<Cliente> {
    const cliente = await this.clienteRepositorio.findOneBy({ id });

    //Verifica se o cliente existe no banco de dados
    if (!cliente) {
      throw new NotFoundException('Cliente não econtrado');
    }

    return cliente;
  }

  public async salvar(cliente:Cliente): Promise<Cliente>{
    const novoCliente = await this.clienteRepositorio.save(cliente);
    return novoCliente;
  }

  public async atualizar(id:number, cliente:Cliente): Promise<Cliente>{
    const editCliente = await this.clienteRepositorio.findOneBy({ id });

    //Verifica se o cliente existe no banco de dados
    if (!editCliente) {
      throw new NotFoundException('Cliente não econtrado');
    }

    editCliente.nome = cliente.nome;
    editCliente.email = cliente.email;
    editCliente.ano = cliente.ano;

    //Salva as alterações
    await this.clienteRepositorio.save(editCliente);

    //Retorna o registro alterado
    return editCliente;
  }

  public async excluir(id:number): Promise<void>{
    await this.clienteRepositorio.delete(id)
  }
}

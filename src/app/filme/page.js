'use client';
import { useState, useEffect } from "react";
import { Box, Heading, Stack, Flex } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import api from "@/utils/axios";
import InputPesquisa from "@/components/InputPesquisa";
import DialogFilme from "@/components/DialogFilme";
import TabelaCrud from "@/components/TabelaCrud";
import PaginationTabela from "@/components/PaginationTabela";
import SelecionarQuantidade from "@/components/SelecionarQuantidade";

export default function FilmePage() {
  const [tasks, setTasks] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [informacoes, setInformacoes] = useState({
    nome: '',
    descricao: '',
    autor: '',
    duracao: '',
    caminhoImagem: '',
    cartaz: []
  });

  const buscarFilme = async () => {
    try {
      const response = await api.get('/filme');
      setTasks(response.data.data);
    } catch (error) {
      toaster.create({
        title: 'Erro ao buscar filmes',
        type: 'error'
      });
    }
  };
  
  const criarTask = async () => {
    try {
      const { nome, descricao, autor, duracao, cartaz } = informacoes;
  
      if (!nome?.trim() || !descricao?.trim() || !autor?.trim() || !duracao?.trim()) return;
  
      setLoadingSave(true);
  
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("descricao", descricao);
      formData.append("autor", autor);
      formData.append("duracao", duracao);
  
      if (cartaz) {
        formData.append("cartaz", cartaz); 
      }
  
      await api.post("/filme", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
  
      toaster.create({
        title: "Filme cadastrado com sucesso",
        type: "success",
      });
  
      await buscarFilme();
      resetForm();
    } catch (error) {
      toaster.create({
        title: "Erro ao cadastrar filme",
        type: "error",
      });
    } 
  };
  
  
  
  const salvarEdicao = async () => {
    try {
      if (!informacoes.nome?.trim() || editingIndex === null) return;
      setLoadingSave(true);
  
      const taskEditar = tasks[editingIndex];
  
      const formData = new FormData();
      formData.append('nome', informacoes.nome);
      formData.append('descricao', informacoes.descricao);
      formData.append('autor', informacoes.autor);
      formData.append('duracao', informacoes.duracao);
      if (informacoes.cartaz) {
        formData.append("cartaz", informacoes.cartaz);
      }
  
      await api.patch(`/filme/${taskEditar.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      toaster.create({
        title: 'Filme editado com sucesso',
        type: 'success',
      });
  
      await buscarFilme();
      resetForm();
    } catch (error) {
      console.error(error);
      toaster.create({
        title: 'Erro ao editar filme',
        type: 'error',
      });
    } 
  };
  

  const excluirTask = async (index, id) => {
    try {
      if (confirm('Você tem certeza que deseja excluir este filme?')) {
        const taskDeletar = tasks[index];
        if (tasks.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }

        await api.delete(`/filme/${id}`);
        toaster.create({
          title: 'Filme excluído com sucesso',
          type: 'sucess'
        });

        await buscarFilme();
      }
    } catch (error) {
      toaster.create({
        title: 'Erro ao excluir filme',
        type: 'error'
      });
      setLoadingSave(false);
    }
  };

  const editarTask = async (index) => {
    const taskEditar = tasks[index];
    setInformacoes({
      nome: taskEditar.nome,
      descricao: taskEditar.descricao,
      autor: taskEditar.autor,
      duracao: taskEditar.duracao,
      caminhoImagem: taskEditar.caminhoImagem,
    });
    setEditingIndex(index);
    setIsOpen(true);
  };

  const resetForm = () => {
    setInformacoes({
      nome: '',
      descricao: '',
      autor: '',
      duracao: '',
      cartaz: []
    });
    setEditingIndex(null);
    setIsOpen(false);
  };

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const tasksAtuais = tasks.slice(indexPrimeiroItem, indexUltimoItem);
  const filteredTasks = tasks.filter(task => task.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    buscarFilme();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <Box p={8}>
      <Heading mb={4}> Filmes </Heading>
      <Flex mb={4} gap={4} align="center">
        <InputPesquisa searchTerm={searchTerm} SetSeachTerm={setSearchTerm} />
        <DialogFilme
          informacoes={informacoes}
          setInformacoes={setInformacoes}
          submit={{ criarTask, salvarEdicao }}
          editingIndex={editingIndex}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          loadingSave={loadingSave}
        />
      </Flex>
      <Stack style={{ display: 'flex', alignItems: 'center' }}>
        <TabelaCrud
          items={tasksAtuais}
          onEdit={editarTask}
          onDelete={excluirTask}
          acoes={true}
          headers={[
            { name: 'ID', value: 'id' },
            { name: 'Nome', value: 'nome' },
            { name: 'Descrição', value: 'descricao' },
            { name: 'Autor', value: 'autor' },
            { name: 'Duração', value: 'duracao' }
          ]}
        />
        <Flex>
          <PaginationTabela
            items={filteredTasks.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <SelecionarQuantidade
            itemsPerPage={itemsPerPage}
            setItemsPerPage={(quantidade) => {
              setItemsPerPage(quantidade);
              setCurrentPage(1);
            }}
          />
        </Flex>
      </Stack>
    </Box>
  );
}

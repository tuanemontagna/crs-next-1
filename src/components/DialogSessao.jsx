import { CloseButton, Dialog, Portal, Input, Button, Stack, Box, Text } from "@chakra-ui/react";
import { MdAdd } from 'react-icons/md';

export default function DialogSessao({
  informacoes, 
  setInformacoes, 
  submit, 
  editingIndex, 
  isOpen, 
  setIsOpen, 
  loadingSave 
}) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button onClick={() => setIsOpen(true)} color="white" background="green" variant="outline" size="sm">
          <MdAdd />
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {editingIndex !== null ? "Editando Sessão" : "Cadastrando Sessão"}
              </Dialog.Title>
              <CloseButton 
                size="sm" 
                onClick={() => setIsOpen(false)} 
                position="absolute" 
                top="1rem" 
                right="1rem" 
              />
            </Dialog.Header>
            <Dialog.Body>
              <Stack spacing={4}>
                <Box>
                  <Text fontWeight="medium" mb={1}>ID do Filme</Text>
                  <Input
                    placeholder="ID do Filme"
                    value={informacoes.idFilme}
                    onChange={(e) => setInformacoes({...informacoes, idFilme: e.target.value})}
                  />
                </Box>
                <Box>
                  <Text fontWeight="medium" mb={1}>ID da Sala</Text>
                  <Input
                    placeholder="ID da Sala"
                    value={informacoes.idSala}
                    onChange={(e) => setInformacoes({...informacoes, idSala: e.target.value})}
                  />
                </Box>
                <Box>
                  <Text fontWeight="medium" mb={1}>Início da Sessão</Text>
                  <Input
                    placeholder="Início sessão"
                    value={informacoes.dataInicio}
                    onChange={(e) => setInformacoes({...informacoes, dataInicio: e.target.value})}
                  />
                </Box>
                <Box>
                  <Text fontWeight="medium" mb={1}>Fim da Sessão</Text>
                  <Input
                    placeholder="Fim sessão"
                    value={informacoes.dataFim}
                    onChange={(e) => setInformacoes({...informacoes, dataFim: e.target.value})}
                  />
                </Box>
                <Box>
                  <Text fontWeight="medium" mb={1}>Valor</Text>
                  <Input
                    placeholder="Valor"
                    value={informacoes.preco}
                    onChange={(e) => setInformacoes({...informacoes, preco: e.target.value})}
                  />
                </Box>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                isLoading={loadingSave}
                color="white"
                background="green"
                variant="outline"
                size="sm"
                onClick={() => {
                  editingIndex !== null ? submit.salvarEdicao() : submit.criarTask();
                }}
              >
                {editingIndex !== null ? "Salvar edição" : "Criar"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

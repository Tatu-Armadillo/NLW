import { useState } from "react";
import { Heading, Text, VStack, useToast } from "native-base";
import { Header } from "../components/Header";

import Logo from "../assets/logo.svg";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

import { api } from "../services/api";

export function New() {
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toats = useToast();

    async function handlePoolCreate() {
        if (!title.trim()) {
            return toats.show({
                title: 'Informe um nome par ao seu bolão',
                placement: 'top',
                bgColor: 'red.500'
            });
        }

        try {
            setIsLoading(true);

            await api.post('/pools', { title })

            toats.show({
                title: 'Bolão criado com sucesso',
                placement: 'top',
                bgColor: 'green.500'
            });

            setTitle('')
        } catch (error) {
            console.log(error);
            toats.show({
                title: 'Não foi possivel criar o bolão',
                placement: 'top',
                bgColor: 'red.500'
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <VStack flex={1} bgColor="black">
            <Header title="Criar novo Bolão" />

            <VStack mt={8} mx={5} alignItems="center">
                <Logo />

                <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
                    Crie seu proprio bolão da copa {'\n'}
                    e compartilhe entre amigos!
                </Heading>

                <Input
                    mb={2}
                    placeholder="Qual nome do seu bolão?"
                    onChangeText={setTitle}
                    value={title}
                />

                <Button
                    title="CRIAR MEU BOLÃO"
                    onPress={handlePoolCreate}
                    isLoading={isLoading}
                />

                <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
                    Após criar seu bolão, você receberá um código único que poderá usar para convidar outras essoas
                </Text>

            </VStack>


        </VStack>
    )
}
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { api } from "../services/api";

import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Find() {
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState('');

    const toats = useToast();
    const { navigate } = useNavigation();
    
    async function handleJoinPool() {
        try {
            setIsLoading(true);

            if (!code.trim()) {
                return toats.show({
                    title: 'Informe o código',
                    placement: 'top',
                    bgColor: 'red.500'
                });
            }

            await api.post('/pools/join', { code });

            toats.show({
                title: 'Você entrou no bolão com sucesso',
                placement: 'top',
                bgColor: 'green.500'
            });

            navigate('pools');

        } catch (error) {
            setIsLoading(false);
            console.log(error);

            if (error.response?.data?.message === 'Pool not found.') {
                return toats.show({
                    title: 'Não foi possivel encontrar o bolão',
                    placement: 'top',
                    bgColor: 'red.500'
                });
            }

            if (error.response?.data?.message === 'You already joined this pool.') {
                return toats.show({
                    title: 'Você já esta neste bolão',
                    placement: 'top',
                    bgColor: 'red.500'
                });
            }

            toats.show({
                title: 'Não foi possivel encontrar o bolão',
                placement: 'top',
                bgColor: 'red.500'
            });
        }
    }

    return (
        <VStack flex={1} bgColor="black">
            <Header title="Buscar por código" showBackButton />

            <VStack mt={8} mx={5} alignItems="center">
                <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
                    Encontrar seu bolão através de  {'\n'}
                    seu código unicoe compartilhe entre amigos!
                </Heading>

                <Input
                    mb={2}
                    placeholder="Qual o codigo do bolão?"
                    autoCapitalize="characters"
                    onChangeText={setCode}
                />

                <Button
                    title="BUSCAR BOLÃO"
                    isLoading={isLoading}
                    onPress={handleJoinPool}
                />

            </VStack>


        </VStack>
    )
}
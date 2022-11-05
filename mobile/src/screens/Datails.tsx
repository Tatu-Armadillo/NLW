import { useState, useEffect } from "react";
import { Share } from "react-native";
import { HStack, useToast, VStack } from "native-base";
import { useRoute } from "@react-navigation/native";

import { api } from "../services/api";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PoolPros } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";


interface RouteParams {
    id: string;
}

export function Details() {
    const toats = useToast();
    const route = useRoute();

    const { id } = route.params as RouteParams;
    const [poolDetails, setPoolDetails] = useState<PoolPros>({} as PoolPros);
    const [isLoading, setIsLoading] = useState(false);
    const [optionSelected, setOptionSelected] = useState<'Seus Palpites' | 'Ranking do grupo'>('Seus Palpites');

    async function handleCodeShare() {
        await Share.share({
            message: poolDetails.code
        });
    }

    async function fetchPoolDetails() {
        try {
            setIsLoading(true);
            const response = await api.get(`/pools/${id}`);

            setPoolDetails(response.data.pool);

        } catch (error) {
            console.log(error);

            toats.show({
                title: 'Não foi possivel carregar os detalhes do bolão',
                placement: 'top',
                bgColor: 'red.500'
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchPoolDetails();
    }, [id]);

    if (isLoading) {
        return (
            <Loading />
        );
    }

    return (
        <VStack flex={1} bgColor="black">
            <Header
                title={poolDetails.title}
                showBackButton
                showShareButton
                onShare={handleCodeShare}
            />

            {
                poolDetails._count?.participants > 0 ?
                    <VStack px={5} flex={1}>
                        <PoolHeader data={poolDetails} />

                        <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                            <Option title="Seus palpites"
                                isSelected={optionSelected === 'Seus Palpites'}
                                onPress={() => setOptionSelected("Seus Palpites")}
                            />
                            <Option title="Ranking do grupo"
                                isSelected={optionSelected === 'Ranking do grupo'}
                                onPress={() => setOptionSelected("Ranking do grupo")}
                            />
                        </HStack>

                        <Guesses poolId={poolDetails.id} code={poolDetails.code} />
                    </VStack>
                    :
                    <EmptyMyPoolList code={poolDetails.code} />
            }
        </VStack>
    );
}
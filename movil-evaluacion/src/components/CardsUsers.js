import React from 'react';

import { View,Text,TouchableOpacity,StyleSheet,Alert,} from 'react-native';
import {deleteDoc, doc,} from 'firebase/firestore';
import { database } from '../config/firebase';

const CardsUsers = ({
    id,
    nombre,
    fecha_nacimiento,
    carnet,
    url,
    navigation,
}) => {

    const getInitials = (name) => {

        if (!name) {
            return 'U';
        }

        const words = name.trim().split(' ');

        if (words.length === 1) {
            return words[0]
                .substring(0, 2)
                .toUpperCase();
        }

        return (
            words[0].charAt(0) +
            words[words.length - 1].charAt(0)
        ).toUpperCase();
    };


    const handleDelete = () => {

        Alert.alert(
            'Eliminar usuario',
            `¿Deseas eliminar a ${nombre}?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },

                {
                    text: 'Eliminar',
                    style: 'destructive',

                    onPress: async () => {

                        try {

                            await deleteDoc(
                                doc(
                                    database,
                                    'users',
                                    id
                                )
                            );

                            Alert.alert(
                                'Eliminado',
                                'El usuario se eliminó correctamente.'
                            );

                        } catch (error) {

                            console.error(
                                'Error eliminando usuario:',
                                error
                            );

                            Alert.alert(
                                'Error',
                                'No se pudo eliminar el usuario.'
                            );
                        }
                    },
                },
            ]
        );
    };


    const handleUpdate = () => {

        navigation.navigate('Update', {
            id: id,
            nombre: nombre,
            fecha_nacimiento: fecha_nacimiento,
            carnet: carnet,
            url: url,
        });

    };


    return (
        <View style={styles.container}>

            <View style={styles.avatar}>

                <Text style={styles.avatarText}>
                    {getInitials(nombre)}
                </Text>

            </View>


            <View style={styles.infoContainer}>

                <View style={styles.nameRow}>

                    <Text
                        style={styles.nombre}
                        numberOfLines={1}
                    >
                        {nombre || 'Sin nombre'}
                    </Text>

                    <View style={styles.statusDot} />

                </View>


                <Text style={styles.carnet}>
                    Carnet: {carnet || 'Sin carnet'}
                </Text>


                <Text style={styles.fecha}>
                    Nacimiento:{' '}
                    {fecha_nacimiento || 'No especificada'}
                </Text>


                <View style={styles.actions}>

                    <TouchableOpacity
                        style={styles.updateButton}
                        onPress={handleUpdate}
                    >
                        <Text style={styles.updateText}>
                            Editar
                        </Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                    >
                        <Text style={styles.deleteText}>
                            Eliminar
                        </Text>
                    </TouchableOpacity>

                </View>

            </View>

        </View>
    );
};


export default CardsUsers;


const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 15,
        paddingHorizontal: 8,

        backgroundColor: '#FFFFFF',

        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },

    avatar: {
        width: 48,
        height: 48,

        borderRadius: 24,

        backgroundColor: '#E8F0FE',

        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 13,
    },

    avatarText: {
        color: '#004AC6',
        fontSize: 14,
        fontWeight: '700',
    },

    infoContainer: {
        flex: 1,
        minWidth: 0,
    },

    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 3,
    },

    nombre: {
        flex: 1,

        fontSize: 15,
        fontWeight: '600',

        color: '#131B2E',

        marginRight: 7,
    },

    statusDot: {
        width: 7,
        height: 7,

        borderRadius: 4,

        backgroundColor: '#006C49',
    },

    carnet: {
        fontSize: 13,
        color: '#737686',

        marginBottom: 2,
    },

    fecha: {
        fontSize: 12,
        color: '#8A8D9B',

        marginBottom: 8,
    },

    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    updateButton: {
        backgroundColor: '#E8F0FE',

        paddingHorizontal: 12,
        paddingVertical: 6,

        borderRadius: 8,

        marginRight: 8,
    },

    updateText: {
        color: '#004AC6',

        fontSize: 12,
        fontWeight: '600',
    },

    deleteButton: {
        backgroundColor: '#FEECEC',

        paddingHorizontal: 12,
        paddingVertical: 6,

        borderRadius: 8,
    },

    deleteText: {
        color: '#BA1A1A',

        fontSize: 12,
        fontWeight: '600',
    },

});
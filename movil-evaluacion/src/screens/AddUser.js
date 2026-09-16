import React, { useState } from 'react';

import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,ScrollView,} from 'react-native';
import {collection,addDoc,serverTimestamp,} from 'firebase/firestore';

import { database } from '../config/firebase';

const AddUser = ({ navigation }) => {

    const [nombre, setNombre] = useState('');
    const [fecha_nacimiento, setFechaNacimiento] = useState('');
    const [carnet, setCarnet] = useState('');
    const [url, setUrl] = useState('');

    const [loading, setLoading] = useState(false);


    const handleAddUser = async () => {

        if (
            nombre.trim() === '' ||
            fecha_nacimiento.trim() === '' ||
            carnet.trim() === ''
        ) {

            Alert.alert(
                'Campos incompletos',
                'Por favor completa nombre, fecha de nacimiento y carnet.'
            );

            return;
        }


        try {

            setLoading(true);


            await addDoc(
                collection(database, 'users'),
                {
                    nombre: nombre.trim(),

                    fecha_nacimiento:
                        fecha_nacimiento.trim(),

                    carnet:
                        carnet.trim(),

                    url:
                        url.trim(),

                    creado:
                        serverTimestamp(),
                }
            );


            Alert.alert(
                'Usuario agregado',
                'El usuario se agregó correctamente.',
                [
                    {
                        text: 'Aceptar',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );


        } catch (error) {

            console.error(
                'Error agregando usuario:',
                error
            );

            Alert.alert(
                'Error',
                'No se pudo agregar el usuario.'
            );


        } finally {

            setLoading(false);

        }

    };
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >

            <View style={styles.header}>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >

                    <Text style={styles.backText}>
                        ‹
                    </Text>

                </TouchableOpacity>


                <View>

                    <Text style={styles.headerTitle}>
                        NUEVO USUARIO
                    </Text>

                    <Text style={styles.headerSubtitle}>
                        Agregar 
                    </Text>

                </View>

            </View>

            <View style={styles.titleContainer}>

                <Text style={styles.title}>
                    Crear usuario
                </Text>

                <Text style={styles.description}>
                    Completa la información del nuevo usuario.
                </Text>

            </View>

            <View style={styles.form}>

                <View style={styles.inputContainer}>

                    <Text style={styles.label}>
                        Nombre
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Ej. Juan Pérez"
                        placeholderTextColor="#8A8D9B"
                        value={nombre}
                        onChangeText={setNombre}
                        autoCapitalize="words"
                    />

                </View>

                <View style={styles.inputContainer}>

                    <Text style={styles.label}>
                        Fecha de nacimiento
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Ej. 15/05/2000"
                        placeholderTextColor="#8A8D9B"
                        value={fecha_nacimiento}
                        onChangeText={setFechaNacimiento}
                        keyboardType="numbers-and-punctuation"
                    />

                </View>

                <View style={styles.inputContainer}>

                    <Text style={styles.label}>
                        Carnet
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Ej. 20240001"
                        placeholderTextColor="#8A8D9B"
                        value={carnet}
                        onChangeText={setCarnet}
                        autoCapitalize="characters"
                    />

                </View>

                <View style={styles.inputContainer}>

                    <Text style={styles.label}>
                        URL de imagen
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="https://..."
                        placeholderTextColor="#8A8D9B"
                        value={url}
                        onChangeText={setUrl}
                        keyboardType="url"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                </View>

                <TouchableOpacity
                    style={[
                        styles.button,
                        loading && styles.buttonDisabled,
                    ]}
                    onPress={handleAddUser}
                    disabled={loading}
                >

                    <Text style={styles.buttonText}>
                        {loading
                            ? 'Guardando...'
                            : 'Agregar usuario'}
                    </Text>

                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                    disabled={loading}
                >

                    <Text style={styles.cancelText}>
                        Cancelar
                    </Text>

                </TouchableOpacity>

            </View>

        </ScrollView>

    );

};


export default AddUser;


const styles = StyleSheet.create({

    container: {
        flex: 1,

        backgroundColor: '#FAF8FF',
    },


    content: {
        paddingBottom: 30,
    },

    header: {
        height: 70,

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 20,

        backgroundColor: '#FAF8FF',

        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },


    backButton: {
        width: 40,
        height: 40,

        borderRadius: 20,

        backgroundColor: '#E8F0FE',

        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 12,
    },


    backText: {
        fontSize: 30,

        color: '#004AC6',

        marginTop: -4,
    },


    headerTitle: {
        fontSize: 13,

        fontWeight: '700',

        letterSpacing: 1.5,

        color: '#131B2E',
    },


    headerSubtitle: {
        fontSize: 11,

        color: '#737686',

        marginTop: 2,
    },

    titleContainer: {
        paddingHorizontal: 20,

        paddingTop: 28,

        paddingBottom: 20,
    },


    title: {
        fontSize: 30,

        fontWeight: '700',

        color: '#131B2E',

        marginBottom: 5,
    },


    description: {
        fontSize: 14,

        color: '#737686',

        lineHeight: 20,
    },
    form: {
        paddingHorizontal: 20,
    },


    inputContainer: {
        marginBottom: 18,
    },


    label: {
        fontSize: 13,

        fontWeight: '600',

        color: '#131B2E',

        marginBottom: 7,
    },


    input: {
        height: 50,

        backgroundColor: '#FFFFFF',

        borderWidth: 1,

        borderColor: '#D8DAE3',

        borderRadius: 10,

        paddingHorizontal: 14,

        fontSize: 14,

        color: '#131B2E',
    },

    button: {
        height: 50,

        borderRadius: 10,

        backgroundColor: '#004AC6',

        justifyContent: 'center',

        alignItems: 'center',

        marginTop: 8,
    },


    buttonDisabled: {
        opacity: 0.6,
    },


    buttonText: {
        color: '#FFFFFF',

        fontSize: 15,

        fontWeight: '700',
    },

    cancelButton: {
        height: 48,

        borderRadius: 10,

        justifyContent: 'center',

        alignItems: 'center',

        marginTop: 10,
    },


    cancelText: {
        color: '#004AC6',

        fontSize: 14,

        fontWeight: '600',
    },

});
import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import {
    collection,
    onSnapshot,
    orderBy,
    query,
} from 'firebase/firestore';

import { database } from '../config/firebase';

import CardsUser from '../components/CardsUsers';


const Users = ({ navigation }) => {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');


    useEffect(() => {

        const q = query(
            collection(database, 'users'),
            orderBy('creado', 'desc')
        );

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {

                const docs = [];

                querySnapshot.forEach((doc) => {

                    docs.push({
                        id: doc.id,
                        ...doc.data(),
                    });

                });

                setUsers(docs);
            },

            (error) => {
                console.error(
                    'Error obteniendo usuarios:',
                    error
                );
            }
        );

        return () => unsubscribe();

    }, []);


    const filteredUsers = users.filter((item) => {

        const nombre = item.nombre
            ? item.nombre.toLowerCase()
            : '';

        const carnet = item.carnet
            ? item.carnet.toLowerCase()
            : '';

        const searchText = search.toLowerCase();

        return (
            nombre.includes(searchText) ||
            carnet.includes(searchText)
        );

    });


    const goToAdd = () => {
        navigation.navigate('Add');
    };


    const renderItem = ({ item }) => {

        return (
            <CardsUser
                id={item.id}
                nombre={item.nombre}
                fecha_nacimiento={item.fecha_nacimiento}
                carnet={item.carnet}
                url={item.url}
                navigation={navigation}
            />
        );

    };


    return (

        <View style={styles.container}>

            {/* HEADER */}

            <View style={styles.header}>

                <View style={styles.headerTitleContainer}>

                    <View style={styles.blueDot} />

                    <Text style={styles.headerTitle}>
                        DIRECTORIO
                    </Text>

                </View>


                <TouchableOpacity
                    style={styles.addButton}
                    onPress={goToAdd}
                >

                    <Text style={styles.addButtonText}>
                        +
                    </Text>

                </TouchableOpacity>

            </View>


            {/* CONTENIDO */}

            <View style={styles.content}>

                <View style={styles.titleRow}>

                    <View>

                        <Text style={styles.title}>
                            Usuarios
                        </Text>

                        <Text style={styles.subtitle}>
                            Directorio corporativo sincronizado
                        </Text>

                    </View>


                    <View style={styles.counter}>

                        <Text style={styles.counterText}>
                            {users.length}
                        </Text>

                    </View>

                </View>


                {/* BUSCADOR */}

                <View style={styles.searchContainer}>

                    <Text style={styles.searchIcon}>
                        🔍
                    </Text>

                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar usuarios..."
                        placeholderTextColor="#737686"
                        value={search}
                        onChangeText={setSearch}
                    />

                </View>


                {/* LISTA */}

                {filteredUsers.length !== 0 ? (

                    <FlatList
                        data={filteredUsers}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                    />

                ) : (

                    <View style={styles.emptyContainer}>

                        <Text style={styles.emptyTitle}>
                            No hay usuarios
                        </Text>

                        <Text style={styles.emptyText}>
                            {search
                                ? 'No se encontraron usuarios con esa búsqueda.'
                                : 'No hay usuarios registrados.'}
                        </Text>

                    </View>

                )}

            </View>


            {/* FOOTER */}

            <View style={styles.footer}>

                <Text style={styles.footerText}>
                    {users.length} usuarios
                </Text>

                <Text style={styles.footerText}>
                    Sincronizado
                </Text>

            </View>

        </View>

    );

};


export default Users;


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FAF8FF',
    },


    /* HEADER */

    header: {
        height: 65,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        paddingHorizontal: 20,

        backgroundColor: '#FAF8FF',

        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },


    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },


    blueDot: {
        width: 9,
        height: 9,

        borderRadius: 5,

        backgroundColor: '#004AC6',

        marginRight: 9,
    },


    headerTitle: {
        fontSize: 13,
        fontWeight: '700',

        letterSpacing: 2,

        color: '#131B2E',
    },


    addButton: {
        width: 40,
        height: 40,

        borderRadius: 20,

        backgroundColor: '#004AC6',

        justifyContent: 'center',
        alignItems: 'center',
    },


    addButtonText: {
        color: '#FFFFFF',

        fontSize: 27,
        fontWeight: '300',

        lineHeight: 30,
    },


    /* CONTENIDO */

    content: {
        flex: 1,

        paddingHorizontal: 20,
        paddingTop: 24,
    },


    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: 18,
    },


    title: {
        fontSize: 32,
        fontWeight: '700',

        color: '#131B2E',

        marginBottom: 4,
    },


    subtitle: {
        fontSize: 13,

        color: '#737686',
    },


    counter: {
        minWidth: 38,
        height: 32,

        paddingHorizontal: 10,

        borderRadius: 16,

        backgroundColor: '#E8F0FE',

        justifyContent: 'center',
        alignItems: 'center',
    },


    counterText: {
        fontSize: 13,
        fontWeight: '700',

        color: '#004AC6',
    },


    /* BUSCADOR */

    searchContainer: {
        height: 48,

        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: '#F2F3FF',

        borderRadius: 12,

        paddingHorizontal: 14,

        marginBottom: 12,
    },


    searchIcon: {
        fontSize: 16,

        marginRight: 8,
    },


    searchInput: {
        flex: 1,

        height: '100%',

        fontSize: 14,

        color: '#131B2E',
    },


    /* LISTA */

    list: {
        paddingBottom: 20,
    },


    /* SIN USUARIOS */

    emptyContainer: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',

        paddingHorizontal: 30,
    },


    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',

        color: '#131B2E',

        marginBottom: 6,
    },


    emptyText: {
        fontSize: 13,

        color: '#737686',

        textAlign: 'center',
    },


    /* FOOTER */

    footer: {
        height: 42,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        paddingHorizontal: 20,

        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',

        backgroundColor: '#FAF8FF',
    },


    footerText: {
        fontSize: 11,

        color: '#737686',
    },

});

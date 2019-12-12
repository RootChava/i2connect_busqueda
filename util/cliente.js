const { obtenerDomicilio } = require("../db/domicilioDB");
const { extractExternalIdsFromI2ConnectSources, cleanID} = require("../util/utility");
const { obtenerClienteReside, obtenerClienteAcceso, obtenerClienteTitular, obtenerTodosCliente, obtenerClienteTermino } = require('../db/clienteDB');

const parsearCliente = (cliente) => {
    return {
        id: cliente.id.toString(),
        typeId: "TENT1",
        properties: {
            TP12: cliente.nombre,
            TP15: cliente.apellidop,
            TP16: cliente.apellidom
        }
    }
};

module.exports = {
    buscarTodosClientes: async () => {
        const clientes = await obtenerTodosCliente().catch((error) => {
            console.log(error);
            next(error);
        });
        return clientes.map(parsearCliente);
    },
    buscarClienteTermino: async (termino) => {
        const clientes = await obtenerClienteTermino(termino).catch((error) => {
            console.log(error);
            next(error);
        });
        return clientes.map(parsearCliente);
    },
    expandirClientes: async (entidades) => {
        const seedIDs = [];
        const promiseTitular = [];
        const promiseAcceso = [];
        const promiseReside = [];
        const promiseDomicilio = [];
        const responseEntities = [];
        const responseLinks = [];
        
        entidades.forEach(entidad => {
            const externalIds = cleanID(Array.from(extractExternalIdsFromI2ConnectSources(entidad.sourceIds))[0]);
            const t = obtenerClienteTitular(externalIds);
            const a = obtenerClienteAcceso(externalIds);
            const r = obtenerClienteReside(externalIds);        
            seedIDs.push({
                internalID: entidad.seedId,
                externalID: externalIds
            });
            promiseAcceso.push(a);
            promiseReside.push(r);
            promiseTitular.push(t);
        });

        const titulares = await Promise.all(promiseTitular).catch(error => {
            console.log(error);
            next(error);
        });

        const accesos = await Promise.all(promiseAcceso).catch(error => {
            console.log(error);
            next(error);
        });

        const resides = await Promise.all(promiseReside).catch(error => {
            console.log(error);
            next(error);
        });

        Array.from(resides).flat().forEach(reside => {
            const domicilios = obtenerDomicilio(reside.id_casa);
            promiseDomicilio.push(domicilios);
        });

        const domicilios = await Promise.all(promiseDomicilio).catch(error => {
            console.log(error);
            next(error);
        });

        Array.from(domicilios).flat().forEach(domicilio => {
            if (!responseEntities.some(e => e.id === domicilio.id.toString() && e.typeId === "TENT4")) {
                responseEntities.push({
                    id: domicilio.id,
                    typeId: "TENT4",
                    properties: {
                        TP11: domicilio.direccion
                    }
                });
            }
        });

        Array.from(resides).flat().forEach(reside => {
            const aux = seedIDs.filter(s => s.externalID === reside.id_persona.toString())
            if (!responseLinks.some(e => e.id === aux[0].internalID + "-" + reside.id_casa && e.typeId === "TENL3")) {
                if (aux.length > 0) {
                    responseLinks.push({
                        id: aux[0].internalID + "-" + reside.id_casa,
                        typeId: "TENL3",
                        linkDirection: "NONE",
                        fromEndId: aux[0].internalID,
                        toEndId: reside.id_casa.toString(),
                    });
                }
            }
        });

        Array.from(titulares).flat().forEach(titular => {
            if (!responseEntities.some(e => e.id === titular.cuenta && e.typeId === "TENT2")) {
                responseEntities.push({
                    id: titular.cuenta,
                    typeId: "TENT2",
                    properties: {
                        TP2: titular.cuenta.toString()
                    }
                });
            }
        });

        Array.from(titulares).flat().forEach(titular => {
            const aux = seedIDs.filter(s => s.externalID === titular.id_cliente.toString())
            if (!responseLinks.some(e => e.id === aux[0].internalID + "-" + titular.cuenta && e.typeId === "TENL1")) {
                if (aux.length > 0) {
                    responseLinks.push({
                        id: aux[0].internalID + "-" + titular.cuenta,
                        typeId: "TENL1",
                        linkDirection: "NONE",
                        fromEndId: aux[0].internalID,
                        toEndId: titular.cuenta.toString(),
                    });
                }
            }
        });

        Array.from(accesos).flat().forEach(acceso => {
            if (!responseEntities.some(e => e.id === acceso.id && e.typeId === "TENT3")) {
                responseEntities.push({
                    id: acceso.id,
                    typeId: "TENT3",
                    properties: {
                        TP1: acceso.no_tel
                    }
                });
            }
        });

        Array.from(accesos).flat().forEach(acceso => {
            const aux = seedIDs.filter(s => s.externalID === acceso.idpersona.toString())
            if (!responseLinks.some(e => e.id === aux[0].internalID + "-" + acceso.id && e.typeId === "TENL2")) {
                if (aux.length > 0) {
                    responseLinks.push({
                        id: aux[0].internalID + "-" + acceso.id,
                        typeId: "TENL2",
                        linkDirection: "NONE",
                        fromEndId: aux[0].internalID,
                        toEndId: acceso.id.toString(),
                    });
                }
            }
        });

        return {
            responseEntities: responseEntities,
            responseLinks: responseLinks,
            seedIDs: seedIDs
        }
    }
}
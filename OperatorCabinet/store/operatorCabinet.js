import apiOperatorCabinet from "@/components/OperatorCabinet/apiOperatorCabinet";

export default {
    namespaced: true,
    state: {
        aircraftClasses: [],
        activeAircraftClass: '',
        activeAircraft: '',
        orderNum: '',
        aircraftItems: [],
        operatorsItems: [],
        flyInfoDesc: '',
        operatorId: 0,
        regNum: '',
        operatorName: '',
        statusSuccess: 0,
        photosExterior: [],
        photosInterior: [],
        priceFlight: 0,
        photosDiagram: [],
        sub: null,
    },
    getters: {
        getAircraftClasses: s => s.aircraftClasses,
        getAircraftItems: s => s.aircraftItems,
        getPriceFlight: s => s.priceFlight,
        getOperatorId: s => s.operatorId,
        getPhotosDiagram: s => s.photosDiagram,
        getPhotosExterior: s => s.photosExterior,
        getPhotosInterior: s => s.photosInterior,
        getOperatorName: s => s.operatorName,
        getOperatorItems: s => s.operatorsItems,
        getActiveAircraft: s => s.activeAircraft,
        getActiveAircraftClass: s => s.activeAircraftClass,
        getStatusSuccess: s => s.statusSuccess,
        getRegNum: s => s.regNum,
        getSub: s => s.sub
    },
    mutations: {
        SET_PRICE_FLIGHT: (s, v) => (v ? s.priceFlight = v : s.priceFlight = 0),
        SET_AIRCRAFT_CLASSES: (s, v) => (s.aircraftClasses = v),
        SET_AIRCRAFT: (s, v) => (s.aircraftItems = v),
        SET_OPERATOR_ID: (s, v) => (s.operatorId = v),
        SET_OPERATOR_NAME: (s, v) => (s.operatorName = v),
        SET_OPERATOR_ITEMS: (s, v) => (s.operatorsItems = v),
        SET_FLY_INFO_DESC: (s, v) => (s.flyInfoDesc = v),
        SET_ACTIVE_AIRCRAFT: (s, v) => (s.activeAircraft = v),
        SET_ACTIVE_AIRCRAFT_CLASS: (s, v) => (s.activeAircraftClass = v),
        SET_SUB: (s, v) => (s.sub = v),
        SET_STATUS_SUCCESS: (s, v) => (s.statusSuccess = v),
        SET_REG_NUM: (s, v) => (s.regNum = v),
        SET_PHOTOS_EXTERIOR: (s, v) => {
            if (v) {
                if (!s.photosExterior.find(el => el.Id === v.Id)) {
                    s.photosExterior.push(v)
                }
            } else {
                s.photosExterior = []
            }
        },
        SET_PHOTOS_INTERIOR: (s, v) => {
            if (v) {
                if (!s.photosInterior.find(el => el.Id === v.Id)) {
                    s.photosInterior.push(v)
                }
            } else {
                s.photosInterior = []
            }
        },
        SET_PHOTOS_DIAGRAM: (s, v) => {
            if (v) {
                if (!s.photosDiagram.find(el => el.Id === v.Id)) {
                    s.photosDiagram.push(v)
                }
            } else {
                s.photosDiagram = []
            }
        }
    },
    actions: {
        setApi({commit}, queryToken) {
            const token = decodeURIComponent(
                escape(window.atob(queryToken))
            );
            commit('SET_SUB', JSON.parse(JSON.parse(atob(token.split(".")[1])).sub));
        },
        async saveOrder({commit}, data) {
            try {
                await apiOperatorCabinet.request.saveOrder(data)
            } catch (e) {
                commit("SET_STATUS_SUCCESS", -1)
                throw new Error(e)
            }
        },
        async getAutocompleteInputs({commit, state}, inputModel) {
            try {
                commit("SET_STATUS_SUCCESS", 0)
                let res = []
                switch (inputModel) {
                    case "aircraftsClasses":
                        res = await apiOperatorCabinet.request.getAircraftsClassesReq()
                        commit('SET_AIRCRAFT_CLASSES', res.data.Data);
                        commit('SET_AIRCRAFT', []);
                        commit('SET_ACTIVE_AIRCRAFT', '');
                        break;
                    case "aircrafts":
                        res = await apiOperatorCabinet.request.getAircraftsItemsReq(state.operatorId)
                        commit('SET_AIRCRAFT', res.data.Data);
                        break;
                    default:
                        break;
                }
            } catch (e) {
                commit("SET_STATUS_SUCCESS", -1)
                throw new Error(e)
            }
        },
        async setOperatorInfo({commit, state}) {
            try {
                commit("SET_STATUS_SUCCESS", 0)
                const res = await apiOperatorCabinet.request.getOperatorsReq(state.sub.OperatorId)
                commit('SET_OPERATOR_ID', state.sub.OperatorId || 0)
                commit('SET_OPERATOR_NAME', res.data.Data[0].Name)
            } catch (e) {
                commit("SET_STATUS_SUCCESS", -1)
                throw new Error(e)
            }
        },
        async saveAircraftImages({commit}, files) {
            try {
                if (files) {
                    commit("SET_STATUS_SUCCESS", 0)
                    await apiOperatorCabinet.request.saveAircraftImages(files)
                    commit("SET_STATUS_SUCCESS", 1)
                }
            } catch (e) {
                commit("SET_STATUS_SUCCESS", -1)
                throw new Error(e)
            }
        },
        async deleteAircraftImages({state, commit}, arr) {
            try {
                switch (arr) {
                    case 'interior': {
                        await apiOperatorCabinet.request.deleteAircraftImage(state.photosInterior[0].Id)
                        commit("SET_PHOTOS_INTERIOR")
                        break;
                    }
                    case 'exterior': {
                        await apiOperatorCabinet.request.deleteAircraftImage(state.photosExterior[0].Id)
                        commit('SET_PHOTOS_EXTERIOR')
                        break;
                    }
                    case 'diagram': {
                        await apiOperatorCabinet.request.deleteAircraftImage(state.photosDiagram[0].Id)
                        commit("SET_PHOTOS_DIAGRAM")
                        break;
                    }
                    default : {
                        break;
                    }
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        async setOperatorsItems({commit, dispatch, state}) {
            try {
                commit("SET_PRICE_FLIGHT")
                commit("SET_STATUS_SUCCESS", 0)
                commit('SET_OPERATOR_ITEMS', [])
                let str = ''
                for (const item of state.sub.Offers) {
                    str = str.length > 0 ? `${str},${item}` : `${item}`
                    commit('SET_FLY_INFO_DESC', item.FlyInfoDescription)
                }
                const res = await apiOperatorCabinet.request.getOrdersFlyInfoReq(str)
                commit('SET_OPERATOR_ITEMS', res.data.Data)
                commit("SET_PRICE_FLIGHT", res.data.Data[0].AmountFromOperator)
                commit('SET_ACTIVE_AIRCRAFT', state.operatorsItems[0].AircraftType)
                commit("SET_REG_NUM", state.operatorsItems[0].AircraftRegNum)
                await dispatch('getAircraftImages')
            } catch (e) {
                commit("SET_STATUS_SUCCESS", -1)
                throw new Error(e)
            }
        },
        async saveForm({dispatch, commit, state}, data) {
            console.log(data)
            try {
                commit('global/SET_LOADING', true, {root: true})
                const amountItem = data.info.budget / state.operatorsItems.length
                const copyItems = [...state.operatorsItems]
                for (let i = 0; i < state.operatorsItems.length; i++) {
                    copyItems[i].OfferStatusId = 3;
                    copyItems[i].AmountFromOperator = amountItem;
                    copyItems[i].AircraftClassId = data.info.aircraftClassId;
                    copyItems[i].AircraftId = data.info.aircraftId;
                    if (data.info.aircraftRegNum.length > 1) {
                        copyItems[i].AircraftRegNum = data.info.aircraftRegNum;
                    }
                    if (data.info.aircraftType.length > 1) {
                        copyItems[i].AircraftType = data.info.aircraftType;
                    }
                    copyItems[i].Description = data.info.comment;
                }
                await dispatch('saveOrder', copyItems)
                const formData = new FormData()
                if (state.regNum.length > 0) {
                    if (data.files.interior.length > 0) {
                        formData.append('interior', data.files.interior[0])
                    }
                    if (data.files.exterior.length > 0) {
                        formData.append('exterior', data.files.exterior[0])
                    }
                    if (data.files.diagram.length > 0) {
                        formData.append('scheme', data.files.diagram[0])
                    }
                    formData.append('RegNum', state.regNum)
                    await dispatch('saveAircraftImages', formData)
                }
            } catch (e) {
                commit("SET_STATUS_SUCCESS", -1)
                throw new Error(e)
            } finally {
                await dispatch("getAircraftImages")
                commit('global/SET_LOADING', false, {root: true})
            }
        },
        async getAircraftImages({commit, state}) {
            try {
                commit('SET_PHOTOS_EXTERIOR')
                commit('SET_PHOTOS_INTERIOR')
                commit('SET_PHOTOS_DIAGRAM')
                if (state.regNum.length > 0) {
                    const resp = await apiOperatorCabinet.request.getAircraftImages(state.regNum)
                    resp.data.Data && resp.data.Data.forEach(el => {
                        switch (el.Type) {
                            case 'exterior': {
                                return commit('SET_PHOTOS_EXTERIOR', el)
                            }
                            case 'interior': {
                                return commit('SET_PHOTOS_INTERIOR', el)
                            }
                            case 'scheme': {
                                return commit('SET_PHOTOS_DIAGRAM', el)
                            }
                            default: {
                                return
                            }
                        }
                    })
                }
            } catch (e) {
                throw new Error(e)
            } finally {
                commit('global/SET_LOADING', false, {root: true})
            }
        }
    }
}

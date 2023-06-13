export default (instance) => {
  return {
    getAircraftsClassesReq: () => instance.get(`aircrafts/classes`),
    // getAircraftsItemsReq: (param) => instance.get(`aircrafts?AircraftClass=${param}`),
    getAircraftsItemsReq: (idx) => instance.get(`aircrafts?OperatorId=${idx}&limit=20`),
    getOperatorsReq: (param) => instance.get(`operators?Id=${param}`),
    getOrdersFlyInfoReq: (param) => instance.get(`orders/offerFlyInfo?Id=${param}`),
    saveOrder: (data) => instance.put('orders/offerFlyInfo', JSON.stringify(data)),
    saveAircraftImages: (data) => instance.post('aircrafts/file', data, {
      'Content-Type': 'multipart/form-data',
    }),
    getAircraftImages: (num) => instance.get(`aircrafts/images?RegNum=${num}`),
    deleteAircraftImage: (id) => instance.delete(`aircrafts/file?Ids=${id}`)
  };
};

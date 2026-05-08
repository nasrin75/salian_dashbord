import Api from "./Api"

export const getFeatures = () => {
    return Api.get('/feature');
}
export const deleteFeature = (featureID) => {
    return Api.delete(`/feature/${featureID}`)
}

export const FeatureDetails = (featureID) => {
    return Api.get(`/feature/${featureID}`)
}
export const createFeature = (data) => {
    return Api.post('/feature', data)
}

export const updateFeature = (data) => {
    return Api.put('/feature', data)
}

export const getFeaturesName = () => {
    return Api.get('/feature/featuresName')
}
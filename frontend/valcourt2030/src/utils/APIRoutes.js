/* LOCAL ENVIRONMENT */
export const host = "http://localhost:3333";

/* PRODUCTION ENVRIONMENT */
// export const host = 'https://9cdd-45-88-190-47.ngrok-free.app';

export const loginRoute = `${host}/auth/login`;
export const registerRoute = `${host}/auth/register`;
export const allTagsRoute = `${host}/tags/getAllTags`;
export const createTagRoute = `${host}/tags/createTag`;
export const allMunicipalitiesRoute = `${host}/municipalities/getAllMunicipalities`;
export const createMunicipalityRoute = `${host}/municipalities/createMunicipality`;
export const updateUserRoute = `${host}/users/updateUser`;
export const deleteUserRoute = `${host}/users/deleteUser`;
export const allEventsRoute = `${host}/events/getAllEvents`;
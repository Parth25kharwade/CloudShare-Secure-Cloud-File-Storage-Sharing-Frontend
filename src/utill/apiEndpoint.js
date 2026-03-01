const BASE_URL="http://localhost:8080/api/v1"

export const apiEndpoints={
    FETCH_FILES:`${BASE_URL}/files/my`,
    TOGGLE_FILE:(id)=>`${BASE_URL}/files/toggle-public/${id}`,
    DOWNLOAD_FILE:(id)=>`${BASE_URL}/files/download/${id}`,
    DELETE_FILE:(id)=>`${BASE_URL}/files/${id}`,
}
type GitlabArtifacts = {
    paths: string[],
    exclude?: string[],
    expire_in?: string,
}

const artifacts = (arti: GitlabArtifacts) => {
    return arti
}

export const Artifacts = {
    create: artifacts,
}
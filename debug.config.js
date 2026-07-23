import { DEBUG_ENABLE_NAMESPACES as DEBUG_ENABLE_NAMESPACES_API } from '@cityssm/voterview-api/debug';
export const DEBUG_NAMESPACE = 'voter-services';
export const DEBUG_ENABLE_NAMESPACES = [
    `${DEBUG_NAMESPACE}:*`,
    DEBUG_ENABLE_NAMESPACES_API
].join(',');
export const PROCESS_ID_MAX_DIGITS = 5;

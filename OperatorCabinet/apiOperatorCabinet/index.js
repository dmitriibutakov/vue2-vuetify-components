import instance from './instance'
import requestModule from './request'

export default {
    request: requestModule(instance)
}

class fetch_socket {
    dashboard(cds){
        return fetch(`${this.domain()}/test?cds=${cds}`,{
                method:'GET',
                headers:{...this.setHeaders()}
            })
            .then(res => res.json())
            .then((data)=> {
                return Promise.resolve(data)
            })
            .catch((error) => {
                return Promise.resolve(error)  
            });
    }

    setHeaders(){
        let head = new Object({
            "Content-Type":"application/json",
            "Accept":"application/json"
        });
        return head
    }

    domain(path,domain,protocol){
        let config = {
            protocol: protocol === 'http' || protocol === 'https' ? protocol:'http',
            domain: typeof domain === 'undefined' ? window.location.hostname+":4000": domain,
            path: typeof path === 'undefined' ? "/api/services": path,
        };
        let domainSocket = `${config.protocol}://${config.domain}${config.path}`;
        return domainSocket        
    }
}
export default fetch_socket;
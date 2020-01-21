# Usage

## `importer(parts)`

This method returns [`@ipld/block]`](https://github.com/ipld/js-block) instances for only the `dag-pb` nodes the UnixFSv1 importer
creates. Since you are passing in the lengths and lengths of the `raw` blocks those are not
returned.

```javascript
const importer = require('unixfsv1-part-importer')
const CID = require('cids')
const raw = new CID('mAVUSIO7K3sMLqZPsJ/6SYMa5HiHBaj81xjniNYRUXbpKl/Ac') // CID of a raw node
const parts = [
  { cidVersion: 1, size: 138102, cid: raw }
]
const blocks = await importer(parts) // contains only the dag-pb nodes for unixfs
```

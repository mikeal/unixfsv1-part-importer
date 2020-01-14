const importer = require('../js-ipfs-unixfs-importer')
const CID = require('cids')
const Block = require('@ipld/block')

const run = async parts => {
  const blocks = []
  const ipld = {
    put: (node, format) => {
      if (format !== 112) {
        throw new Error('Should only receive dag-pb nodes')
      }
      const block = Block.encoder(node, 'dag-pb')
      blocks.push(block)
      return block.cid()
    }
  }
  const content = async function * () {
    yield * parts
  }
  const options = {
    rawLeaves: true,
    reduceSingleLeafToSelf: false,
    chunker: x => x,
    chunkValidator: x => x,
    bufferImporter: async function * (file, source, ipld, options) {
      for await (const item of source) {
        yield () => Promise.resolve(item)
      }
    }
  }
  for await (const part of importer([{content: content()}], ipld, options)) {
    // noop
  }
  return blocks
}

module.exports = run

/*
const parts = [
  { cidVersion: 1, size: 138102, cid: new CID('mAVUSIO7K3sMLqZPsJ/6SYMa5HiHBaj81xjniNYRUXbpKl/Ac') }
]

run(parts)
*/

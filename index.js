const importer = require('ipfs-unixfs-importer')
const Block = require('@ipld/block')

const run = async parts => {
  const blocks = []
  const ipld = {
    put: (node, format) => {
      /* istanbul ignore if */
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
  const iter = importer([{ content: content() }], ipld, options)
  let chunk
  do {
    chunk = await iter.next()
  } while (!chunk.done)
  return blocks
}

module.exports = run

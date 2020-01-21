'use strict'
/* globals it */
const main = require('../')
const assert = require('assert')
const CID = require('cids')

const test = it
const same = assert.deepStrictEqual

test('basic encode', async () => {
  const rawNode = new CID('mAVUSIO7K3sMLqZPsJ/6SYMa5HiHBaj81xjniNYRUXbpKl/Ac')
  const parts = [
    { cidVersion: 1, size: 138102, cid: rawNode }
  ]
  const blocks = await main(parts)
  same(blocks.length, 1)

  const node = blocks[0].decode()
  same(node.Links.length, 1)
  same(node.Links[0].Tsize, 138102)
  same(node.Links[0].Hash.toString(), rawNode.toString())
  same(node.size, 138160)
})

test('large file', async () => {
  const rawNode = new CID('mAVUSIO7K3sMLqZPsJ/6SYMa5HiHBaj81xjniNYRUXbpKl/Ac')
  const parts = []
  for (let i = 0; i < 500; i++) {
    parts.push({ cidVersion: 1, size: 138102, cid: rawNode })
  }
  const blocks = await main(parts)
  const ll = i => blocks[i].decode().Links.length
  same(ll(0), 174)
  same(ll(1), 174)
  same(ll(2), 152)
  same(ll(3), 3)
})

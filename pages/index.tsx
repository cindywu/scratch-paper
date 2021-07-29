import React, { useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
// import Editor from '../components/editor'


import 'prosemirror-view/style/prosemirror.css'
// import './styles.css'

import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
// import { ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo } from 'y-prosemirror'
import { history, undo, redo } from 'prosemirror-history'
import { schema } from 'prosemirror-schema-basic'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap, Command, toggleMark } from 'prosemirror-commands'
import { MarkType } from 'prosemirror-model'
import { useProseMirror, ProseMirror } from 'use-prosemirror'
import { EditorState, Transaction } from 'prosemirror-state'

const toggleBold = toggleMarkCommand(schema.marks.strong)
const toggleItalic = toggleMarkCommand(schema.marks.em)

const ydoc = new Y.Doc()
// const provider = new WebsocketProvider('wss://localhost:3000', 'cindy-room', ydoc)
const type = ydoc.getXmlFragment('prosemirror')

// provider.on('status', (event: any) => {
//   console.log(event.status) // logs "connected" or "disconnected"
// })

const opts: Parameters<typeof useProseMirror>[0] = {
  schema,
  plugins: [
    // ySyncPlugin(type),
    // yCursorPlugin(provider.awareness),
    // yUndoPlugin(),
    history(),
    keymap({
      ...baseKeymap,
      "Mod-z": undo,
      "Mod-y": redo,
      "Mod-Shift-z": redo,
      "Mod-b": toggleBold,
      "Mod-i": toggleItalic
    })
  ]
}

export default function Editor() {
  const [state, setState] = useProseMirror(opts);
  return (
    <>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            scratch paper
          </h1>
        </main>
      </div>
      <div className="App">
        <div className="ProseMirrorContainer" spellCheck="false" placeholder="type here">
          <ProseMirror
            className="ProseMirror"
            state={state}
            onChange={setState}
          />
        </div>
      </div>
    </>
  )
}


function toggleMarkCommand(mark: MarkType): Command {
  return (
    state: EditorState,
    dispatch: ((tr: Transaction) => void) | undefined
  ) => toggleMark(mark)(state, dispatch)
}
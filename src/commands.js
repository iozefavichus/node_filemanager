const add = async (filePath) => {
	try {
    await writeFile(filePath, '', { flag: 'wx' })
  } catch {
		throw new Error('Failed to add file');
  }
}


export {add};
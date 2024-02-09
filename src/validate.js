export const validate = (command, args) => {
    switch (command) {
      case '.exit':
      case 'up':
      case 'ls':
        if(args.length === 0) {
          return true;
        }
        return false;

      case 'cat':
      case 'add':
      case 'rm':
      case 'hash':
      case 'cd':
      case 'os':
        if(args.length === 1) {
          return true;
        }
        return false;
      case 'rn':
      case 'cp':
      case 'mv':
      case 'compress':
      case 'decompress':
        if(args.length === 2) {
          return true;
        }
        return false;
      default:
        return false;
    }
  }
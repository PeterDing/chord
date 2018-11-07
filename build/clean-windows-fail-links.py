import os


def exists(path):
    return os.path.exists(path)


def listdirs(path):
    return os.listdir(path)


def remove(path):
    return os.removedirs(path)


ROOT = r'..\node_modules'


def main():
    if not exists(ROOT):
        return

    for (dirpath, dirnames, filenames) in os.walk(ROOT):
        for dirname in dirnames:
            path = os.path.join(dirpath, dirname)
            try:
                listdirs(path)
            except WindowsError:
                print 'rm "%s"' % path
                remove(path)


if __name__ == '__main__':
    main()

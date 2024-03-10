export default function capitalizeFirstLetter(string: string) {
    return string[0] + string.slice(1).toLowerCase();
}
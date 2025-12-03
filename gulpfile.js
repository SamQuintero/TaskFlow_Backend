import gulp from "gulp";
import ts from "gulp-typescript";
import copy from "gulp-copy";

// Inicializa los proyectos TypeScript basados en tsconfig.json
const tsProject = ts.createProject("tsconfig.json");
const tsConfigProject = ts.createProject("tsconfig.json");

// 1. Tarea principal de scripts: Compila todo el código de 'src'
export const scripts = () => {
    // Compila src/**/*.ts y lo envía a dist/src
    return gulp.src("src/**/*.ts")
        .pipe(tsProject())
        .pipe(gulp.dest("dist/src"));
}

// 2. Tarea de configuración: Compila SOLO swagger.config.ts 
//    (usa tsConfigProject para mantener consistencia con la configuración ES modules)
export const scriptsConfig = () => {
    // Compila swagger.config.ts y lo coloca en la raíz de dist
    return gulp.src("./swagger.config.ts") 
        .pipe(tsConfigProject())
        .pipe(gulp.dest("dist"));
}

// 3. Tarea de Vistas: Copia los archivos de plantillas (hbs/handlebars)
export const views = () => {
    // Copia archivos .hbs y .handlebars al directorio 'dist'
    return gulp.src(["src/**/*.hbs", "src/**/*.handlebars"])
        .pipe(copy('dist'));
}

// --- Tarea de Build Final ---

// Ejecuta la compilación de scripts, la configuración de swagger y la copia de vistas en paralelo.
export const build = gulp.parallel(scripts, scriptsConfig, views);

export default build;